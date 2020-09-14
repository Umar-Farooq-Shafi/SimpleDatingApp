using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepo : IDatingRepo
    {
        private readonly DataContext _context;

        public DatingRepo(DataContext context)
        {
            _context = context;
        }

        // ADDING: User into DB
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        // DELETING: User into DB
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        // CHECKING: Data save into DB
        public async Task<bool> SaveAll() => await _context.SaveChangesAsync() > 0;

        // GETTING: The lists of all user from DB
        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos)
                .OrderBy(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);

            users = users.Where(u => u.Gender == userParams.Gender);

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDOB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDOB = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDOB && u.DateOfBirth <= maxDOB);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
                switch (userParams.OrderBy)
                {
                    case "createdAt":
                        users = users.OrderByDescending(u => u.CreatedAt);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users
                .Include(x => x.Likers)
                .Include(x => x.Likees)
                .FirstOrDefaultAsync(u => u.Id == id);

            return likers ? user.Likers
                .Where(u => u.LikeeId == id).Select(i => i.LikerId) :
                user.Likees
                .Where(u => u.LikerId == id).Select(i => i.LikeeId);
        }

        // GETTING: A single user from DB
        public async Task<User> GetUser(int id, bool isCurrentUser)
        {
            var query = _context.Users.Include(p => p.Photos)
            .AsQueryable();

            if(isCurrentUser)
                query = query.IgnoreQueryFilters();
            
           return  await query
            .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<Photo> GetPhoto(int id) => 
            await _context.Photos.IgnoreQueryFilters()
                .FirstOrDefaultAsync(p => p.Id == id);

        public async Task<Photo> GetMainPhotoForUser(int userId) =>
            await _context.Photos.Where(u => u.UserId == userId)
            .FirstOrDefaultAsync(p => p.IsMain);

        public async Task<Like> GetLike(int userId, int recipientId) => await _context.Likes.FirstOrDefaultAsync(u =>
          u.LikerId == userId && u.LikeeId == recipientId);

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var message = _context.Messages
                .Include(u => u.Sender)
                .ThenInclude(p => p.Photos)
                .Include(u => u.Recipient)
                .ThenInclude(p => p.Photos)
                .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    message = message.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    message = message.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                    break;
                default:
                    message = message.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false && u.IsRead == false);
                    break;
            }

            message = message.OrderByDescending(d => d.MessageSent);

            return await PagedList<Message>.CreateAsync(message, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var message = await _context.Messages
                .Include(u => u.Sender)
                .ThenInclude(p => p.Photos)
                .Include(u => u.Recipient)
                .ThenInclude(p => p.Photos)
                .Where(m => m.RecipientId == userId && m.RecipientDeleted == false && m.SenderId == recipientId
                            || m.RecipientId == recipientId && m.SenderId == userId && m.SenderDeleted == false)
                .OrderByDescending(o => o.MessageSent)
                .ToListAsync();

            return message;
        }
    }
}