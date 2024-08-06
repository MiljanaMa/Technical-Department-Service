using Technical_Department.API.Startup;
using Technical_Department.Kitchen.API.Public;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.ConfigureSwagger(builder.Configuration);
const string corsPolicy = "_corsPolicy";
builder.Services.ConfigureCors(corsPolicy);
builder.Services.ConfigureAuth();
builder.Services.RegisterModules();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var initializationService = scope.ServiceProvider.GetRequiredService<IWeeklyMenuService>();
    await initializationService.WeeklyMenuStartupCheck(); // Initialize async
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

app.UseRouting();
app.UseCors(corsPolicy);

app.UseHttpsRedirection();
//app.UseAuthorization();
//app.UseAuthorization();

app.MapControllers();

app.Run();
