using System.Net;
using System.Text;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API {
    public class Startup {
        public Startup (IConfiguration configuration) {
            Configuration = configuration;
        }

        private IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices (IServiceCollection services) {
            // CONFIG: for sqlite DB
            services.AddDbContext<DataContext> (x =>
                x.UseSqlite (Configuration.GetConnectionString ("DefaultConnection")));

            // CONFIG: changing identity core default config
            IdentityBuilder builder = services.AddIdentityCore<User>(opt => {
                opt.Password.RequireDigit = false;
                opt.Password.RequiredLength = 4;
                opt.Password.RequireNonAlphanumeric = false;
                opt.Password.RequireUppercase = false;
            });
            builder = new IdentityBuilder(builder.UserType, typeof(Role), builder.Services);
            builder.AddEntityFrameworkStores<DataContext>();
            builder.AddRoleValidator<RoleValidator<Role>>();
            builder.AddRoleManager<RoleManager<Role>>();
            builder.AddSignInManager<SignInManager<User>>();

            // CONFIG: Guard for Authenticated user
            services.AddAuthentication (JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer (options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey (Encoding.ASCII.GetBytes (
                    Configuration.GetSection ("AppSettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                    };
                });

            // CONFIG: Guard for Authorized user
            services.AddAuthorization(opt => {
                opt.AddPolicy("RequireAdminRole", p => p.RequireRole("Admin"));
                opt.AddPolicy("ModeratePhotoRole", p => p.RequireRole("Admin", "Moderator"));
                opt.AddPolicy("VipOnly", p => p.RequireRole("VIP"));
            });

            // CONFIG: Controllers
            services.AddControllers ().SetCompatibilityVersion (CompatibilityVersion.Latest);

            // CONFIG: MVC pattern
            services.AddMvc (opt => {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();

                opt.Filters.Add(new AuthorizeFilter(policy));
            }).SetCompatibilityVersion (CompatibilityVersion.Latest)
                .AddNewtonsoftJson (opt => {
                    opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            // CONFIG: for cors platform access
            services.AddCors ();

            // CONFIG: Setting for cloudinary
            services.Configure<CloudinarySettings> (Configuration.GetSection ("CloudinarySettings"));

            // CONFIG: for AUTO-Mapper dep injections platform access
            Mapper.Reset();
            services.AddAutoMapper ();

            // CONFIG: Seeding the user data into DB
            services.AddTransient<Seed> ();

            // CONFIG: Register the Repo into APP
            services.AddScoped<IDatingRepo, DatingRepo> ();            
            services.AddScoped<LogUserActivity> ();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure (IApplicationBuilder app, IWebHostEnvironment env, Seed seed) {
            if (env.IsDevelopment ()) {
                app.UseDeveloperExceptionPage ();
            } else app.UseExceptionHandler (builder => { // Handling exception errors
                builder.Run (async context => {
                    context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                    var error = context.Features.Get<IExceptionHandlerFeature> ();
                    if (error != null) {
                        context.Response.AddApplicationError (error.Error.Message);
                        await context.Response.WriteAsync (error.Error.Message);
                    }
                });
            });

            app.UseHttpsRedirection ();

            seed.SeedUser(); // TODO: Uncomment if you want to seed user data into DB

            app.UseCors (x => x.AllowAnyOrigin ().AllowAnyMethod ().AllowAnyHeader ());

            app.UseAuthentication ();

            app.UseRouting ();
            // app.UseMvc();

            app.UseAuthorization ();

            app.UseEndpoints (endpoints => {
                endpoints.MapControllers ();
            });
        }
    }
}