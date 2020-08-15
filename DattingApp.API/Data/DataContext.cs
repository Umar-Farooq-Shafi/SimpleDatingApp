using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DbSet<Value> Values { get; set; }

        public DataContext(DbContextOptions<DataContext> options): base(options)
        {
            
        }
    }
}
