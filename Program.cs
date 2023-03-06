var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

// builder.Services.AddCors(options =>
//     {
//         options.AddPolicy("AllowAllOrigins",
//             builder =>
//             {
//                 // builder.AllowAnyOrigin();
//                 builder.WithOrigins("https://bgangularstorage.blob.core.windows.net");
//             });
//     });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
// app.UseCors("AllowAllOrigins");


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
