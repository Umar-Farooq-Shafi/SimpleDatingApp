using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    // BLUEPRINT: Skeleton
    public interface IAuthRepo
    {
        Task<User> Register(User user, string password);
        Task<User> Login(string username, string password);
        Task<bool> UserExists(string username);
    }
}
