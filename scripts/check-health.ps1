param(
    [string]$HealthUrl = "https://backend-production-dba7.up.railway.app/actuator/health"
)

try {
    $response = Invoke-WebRequest -Uri $HealthUrl -UseBasicParsing -TimeoutSec 20
    if ($response.StatusCode -eq 200) {
        Write-Host "HEALTH_OK: $HealthUrl"
        exit 0
    }

    Write-Host "HEALTH_WARN: $HealthUrl returned status $($response.StatusCode)"
    exit 1
} catch {
    Write-Host "HEALTH_DOWN: $HealthUrl - $($_.Exception.Message)"
    exit 1
}
