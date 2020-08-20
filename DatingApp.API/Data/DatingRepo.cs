using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data {
    public class DatingRepo : IDatingRepo {
        private readonly DataContext _context;

        public DatingRepo (DataContext context) {
            _context = context;
        }

        // ADDING: User into DB
        public void Add<T> (T entity) where T : class {
            _context.Add (entity);
        }

        // DELETING: User into DB
        public void Delete<T> (T entity) where T : class {
            _context.Remove (entity);
        }

        // CHECKING: Data save into DB
        public async Task<bool> SaveAll () => await _context.SaveChangesAsync () > 0;

        // GETTING: The lists of all user from DB
        public async Task<PagedList<User>> GetUsers (UserParams userParams) {
            var users = _context.Users.Include (p => p.Photos)
                .OrderBy (u => u.LastActive).AsQueryable ();

            users = users.Where (u => u.Id != userParams.UserId);

            users = users.Where (u => u.Gender == userParams.Gender);

            if (userParams.MinAge != 18 || userParams.MaxAge != 99) {
                var minDOB = DateTime.Today.AddYears (-userParams.MaxAge - 1);
                var maxDOB = DateTime.Today.AddYears (-userParams.MinAge);

                users = users.Where (u => u.DateOfBirth >= minDOB && u.DateOfBirth <= maxDOB);
            }

            if (!string.IsNullOrEmpty (userParams.OrderBy))
                switch (userParams.OrderBy) {
                    case "createdAt":
                        users = users.OrderByDescending (u => u.CreatedAt);
                        break;
                    default:
                        users = users.OrderByDescending (u => u.LastActive);
                        break;
                }

            return await PagedList<User>.CreateAsync (users, userParams.PageNumber, userParams.PageSize);
        }

        // GETTING: A single user from DB
        public async Task<User> GetUser (int id) => await _context.Users.Include (p => p.Photos)
            .FirstOrDefaultAsync (u => u.Id == id);

        public async Task<Photo> GetPhoto (int id) => await _context.Photos.FirstOrDefaultAsync (p => p.Id == id);

        public async Task<Photo> GetMainPhotoForUser (int userId) =>
            await _context.Photos.Where (u => u.UserId == userId)
            .FirstOrDefaultAsync (p => p.IsMain);
    }
}