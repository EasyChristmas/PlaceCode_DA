using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Api.Extensions
{
    public static class RegisterServiceExtension
    {
        /// <summary>
        /// Add Scoped from InterfaceAssembly and ImplementAssembly to the specified Microsoft.Extensions.DependencyInjection.IServiceCollection.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="implementAssembly"></param>
        public static void AddScopeds(this IServiceCollection services, Assembly implementAssembly)
        {
            var implements = implementAssembly.GetTypes();
            //只注入以“Service”结尾的服务类型
            var serviceTypes = implements.Where(x => x.FullName.EndsWith("Service")).ToList();
            foreach (var item in serviceTypes)
            {
                //排除掉已注入的服务类型
                if (!services.Any(x => x.ServiceType == item))
                    services.AddScoped(item);
            }
        }

        /// <summary>
        /// Add AddSingleton from InterfaceAssembly and ImplementAssembly to the specified Microsoft.Extensions.DependencyInjection.IServiceCollection.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="implementAssembly"></param>
        public static void AddSingletons(this IServiceCollection services, Assembly implementAssembly)
        {
            var implements = implementAssembly.GetTypes();
            //只注入以“Service”结尾的服务类型
            var serviceTypes = implements.Where(x => x.FullName.EndsWith("Service")).ToList();
            foreach (var item in serviceTypes)
            {
                //排除掉已注入的服务类型
                if (!services.Any(x => x.ServiceType == item))
                    services.AddSingleton(item);
            }
        }

        /// <summary>
        /// Add AddTransient from InterfaceAssembly and ImplementAssembly to the specified Microsoft.Extensions.DependencyInjection.IServiceCollection.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="interfaceAssembly"></param>
        /// <param name="implementAssembly"></param>
        public static void AddTransients(this IServiceCollection services, Assembly implementAssembly)
        {
            var implements = implementAssembly.GetTypes();
            //只注入以“Service”结尾的服务类型
            var serviceTypes = implements.Where(x => x.FullName.EndsWith("Service")).ToList();
            foreach (var item in serviceTypes)
            {
                //排除掉已注入的服务类型
                if (!services.Any(x => x.ServiceType == item))
                    services.AddTransient(item);
            }
        }
    }
}
