// --------------------------------------------------------------------
// <copyright file="Program.cs" company="Ellucian">
//     Copyright 2021 Ellucian Company L.P. and its affiliates.
// </copyright>
// --------------------------------------------------------------------

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;

namespace SelfService
{
    /// <summary>
    /// Program
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Creates the host builder.
        /// </summary>
        /// <param name="args">The arguments.</param>
        /// <returns></returns>
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    config.AddJsonFile("Config/AuthenticationSettings.json",
                        optional: true,
                        reloadOnChange: true);
                    config.AddJsonFile($"Config/AuthenticationSettings.{hostingContext.HostingEnvironment.EnvironmentName}.json",
                        optional: true,
                        reloadOnChange: true);
                    config.AddJsonFile("Config/ConnectionSettings.json",
                        optional: true,
                        reloadOnChange: true);
                    config.AddJsonFile($"Config/ConnectionSettings.{hostingContext.HostingEnvironment.EnvironmentName}.json",
                        optional: true,
                        reloadOnChange: true);
                    config.AddJsonFile("Config/NotificationSettings.json",
                        optional: true,
                        reloadOnChange: true);
                    config.AddJsonFile($"Config/NotificationSettings.{hostingContext.HostingEnvironment.EnvironmentName}.json",
                        optional: true,
                        reloadOnChange: true);
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                })
                .UseSerilog();

        /// <summary>
        /// Defines the entry point of the application.
        /// </summary>
        /// <param name="args">The arguments.</param>
        public static void Main(string[] args) => CreateHostBuilder(args).Build().Run();
    }
}