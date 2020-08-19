using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public async Task<IEnumerable<User>> GetUsers() => await _context.Users.Include(p => p.Photos)
            .ToListAsync();

        // GETTING: A single user from DB
        public async Task<User> GetUser(int id) => await _context.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(u => u.Id == id);

        public async Task<Photo> GetPhoto(int id) => await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

        public async Task<Photo> GetMainPhotoForUser(int userId) =>
        await _context.Photos.Where(u => u.UserId == userId)
            .FirstOrDefaultAsync(p => p.IsMain);
    }
}