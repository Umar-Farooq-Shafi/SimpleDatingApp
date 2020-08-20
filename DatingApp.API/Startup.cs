using System.Net;
using System.Text;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

            // CONFIG: Controllers
            services.AddControllers ().SetCompatibilityVersion (CompatibilityVersion.Latest);

            // CONFIG: MVC pattern
            services.AddMvc ().SetCompatibilityVersion (CompatibilityVersion.Latest)
                .AddNewtonsoftJson (opt => {
                    opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            // CONFIG: for cors platform access
            services.AddCors ();

            // CONFIG: Setting for cloudinary
            services.Configure<CloudinarySettings> (Configuration.GetSection ("CloudinarySettings"));

            // CONFIG: for AUTO-Mapper dep injections platform access
            services.AddAutoMapper ();

            // CONFIG: Seeding the user data into DB
            services.AddTransient<Seed> ();

            // CONFIG: Register the Repo into APP
            services.AddScoped<IAuthRepo, AuthRepo> ();
            services.AddScoped<IDatingRepo, DatingRepo> ();

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

            // seed.SeedUser(); // TODO: Uncomment if you want to seed user data into DB

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