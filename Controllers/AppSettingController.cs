using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AngularApp.Controllers;

[ApiController]
[Route("[controller]")]
public class AppSettingController : ControllerBase
{
    private readonly ILogger<AppSettingController> _logger;
    private readonly IConfiguration config;

    public AppSettingController(ILogger<AppSettingController> logger, IConfiguration config)
    {
        _logger = logger;
        this.config = config;
    }

    [HttpGet]
    public string Get()
    {
        var settings = new { 
            blobAccount = config["azure:blob_account"], 
            blobSas = config["azure:blob_SAS"], 
            blobSasReadOnly = config["azure:blob_SASReadOnly"], 
        };

        return JsonConvert.SerializeObject(settings);
    }
}
