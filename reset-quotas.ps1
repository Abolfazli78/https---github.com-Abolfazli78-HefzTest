# Reset user quotas for student@test.com
$email = "student@test.com"
$phone = "9121112225"

$body = @{
    email = $email
    phone = $phone
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/admin/reset-user-quotas" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    
    Write-Host "✅ Response: $($response.Content)"
    Write-Host "✅ Status: $($response.StatusCode)"
    
    if ($response.StatusCode -eq 200) {
        Write-Host "🎉 User quotas reset successfully!"
    } else {
        Write-Host "❌ Failed to reset quotas"
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
