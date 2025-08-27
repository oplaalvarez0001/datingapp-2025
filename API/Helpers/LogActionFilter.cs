using System;
using System.Diagnostics;
using System.Text.Json;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers;

public class LogActionFilter : IAsyncActionFilter
{
    private readonly ILogger<LogActionFilter> _logger;

    public LogActionFilter(ILogger<LogActionFilter> logger)
    {
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var operationIdentifier = System.Guid.NewGuid();
        // Log information before the action is executed
        var stopwatch = new Stopwatch();
        stopwatch.Start();

        _logger.LogInformation("{operationIdentifier} - Executing action: {ActionName} from controller: {ControllerName} at {Timestamp}",
            operationIdentifier,
            context.ActionDescriptor.RouteValues["action"],
            context.ActionDescriptor.RouteValues["controller"],
            DateTimeOffset.UtcNow);

        // Log request payload (if available)
        if (context.ActionArguments.Count > 0)
        {
            var requestPayload = System.Text.Json.JsonSerializer.Serialize(context.ActionArguments);
            _logger.LogInformation("{operationIdentifier} - Request Payload: {Payload}", operationIdentifier, requestPayload);
        }

        // Execute the next filter or the action method itself
        var resultContext = await next();

        if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var memberId = resultContext.HttpContext.User.GetMemberId();

        // Log information after the action is executed
        stopwatch.Stop();

        _logger.LogInformation("{operationIdentifier} - Member {memberId} finished executing action: {ActionName} with status code: {StatusCode} in {ElapsedMilliseconds}ms at {Timestamp}",
            operationIdentifier,
            memberId,
            resultContext.ActionDescriptor.RouteValues["action"],
            resultContext.HttpContext.Response.StatusCode,
            stopwatch.ElapsedMilliseconds,
            DateTimeOffset.UtcNow);

        // Inspect and log the result object
        if (resultContext.Result is ObjectResult objectResult)
        {
            var responseBody = JsonSerializer.Serialize(objectResult.Value);
            _logger.LogInformation("{operationIdentifier} - Response Body: {ResponseBody}", operationIdentifier, responseBody);
        }
        else if (resultContext.Result is ContentResult contentResult)
        {
            _logger.LogInformation("{operationIdentifier} - Response Body: {ResponseBody}", operationIdentifier, contentResult.Content);
        }
        else if (resultContext.Result is JsonResult jsonResult)
        {
            var responseBody = JsonSerializer.Serialize(jsonResult.Value);
            _logger.LogInformation("{operationIdentifier} - Response Body: {ResponseBody}", operationIdentifier, responseBody);
        }
        // Add more cases for other IActionResult types as needed
    }
}

