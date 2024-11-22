using System.Security.Cryptography.X509Certificates;
using System.Text;
using Duende.IdentityServer;
using IdentityServer;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Tokens;
using Serilog;

namespace IdentityServer;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        // var directory = $@"file:///{AppDomain.CurrentDomain.BaseDirectory}keys\is-signing-key-8864F64E026CFDB297D91DC8AFCFE2CC.json";
        // builder.Services.AddDataProtection()
        //         .PersistKeysToFileSystem(new DirectoryInfo(directory));
        //builder.Services.AddDataProtection()
        //    .PersistKeysToFileSystem(new DirectoryInfo(@"/app/keys"));
        
        var isBuilder = builder.Services.AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;

                // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
                options.EmitStaticAudienceClaim = true;
            })
            //.AddSigningCredential(new SymmetricSecurityKey(Encoding.UTF8.GetBytes("Gvpi/STBVYzpLTaR4RiMd1L/5HBE8gIwbxud+M/f2cg=")), SecurityAlgorithms.HmacSha256)
            //.AddSigningCredential(new X509Certificate2("/https/localhost-dev-cert.pfx", "12345678"))
            .AddTestUsers(TestUsers.Users);

        //isBuilder.AddDeveloperSigningCredential();
        
        // in-memory, code config
        isBuilder.AddInMemoryIdentityResources(Config.IdentityResources);
        isBuilder.AddInMemoryApiScopes(Config.ApiScopes);
        isBuilder.AddInMemoryApiResources(Config.ApiResources);
        isBuilder.AddInMemoryClients(Config.Clients);
        
        // if you want to use server-side sessions: https://blog.duendesoftware.com/posts/20220406_session_management/
        // then enable it
        //isBuilder.AddServerSideSessions();
        //
        // and put some authorization on the admin/management pages
        //builder.Services.AddAuthorization(options =>
        //       options.AddPolicy("admin",
        //           policy => policy.RequireClaim("sub", "1"))
        //   );
        //builder.Services.Configure<RazorPagesOptions>(options =>
        //    options.Conventions.AuthorizeFolder("/ServerSideSessions", "admin"));


        //builder.Services.AddAuthentication();
        //    .AddGoogle(options =>
        //    {
        //        options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

        //        // register your IdentityServer with Google at https://console.developers.google.com
        //        // enable the Google+ API
        //        // set the redirect URI to https://localhost:5001/signin-google
        //        options.ClientId = "copy client ID from Google here";
        //        options.ClientSecret = "copy client secret from Google here";
        //    });

        return builder.Build();
    }
    
    public static WebApplication ConfigurePipeline(this WebApplication app)
    { 
        app.UseSerilogRequestLogging();
    
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseIdentityServer();
        app.UseAuthorization();
        
        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }
}