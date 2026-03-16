$ErrorActionPreference = 'Stop'

$base = 'http://localhost:8080/api'

$docEmail = 'doc.test.' + (Get-Random) + '@example.com'
$patEmail = 'pat.test.' + (Get-Random) + '@example.com'

$docReg = @{
  name     = 'Dr Test'
  email    = $docEmail
  password = 'Test@1234'
  role     = 'DOCTOR'
} | ConvertTo-Json

$patReg = @{
  name     = 'Pat Test'
  email    = $patEmail
  password = 'Test@1234'
  role     = 'PATIENT'
} | ConvertTo-Json

$null = Invoke-RestMethod -Method Post -Uri ($base + '/auth/register') -ContentType 'application/json' -Body $docReg
$patAuth = Invoke-RestMethod -Method Post -Uri ($base + '/auth/register') -ContentType 'application/json' -Body $patReg
$patToken = $patAuth.data.token

$docs = Invoke-RestMethod -Uri ($base + '/doctors') -Headers @{ Authorization = ('Bearer ' + $patToken) }
$firstDocId = $docs.data[0].id

$book = @{
  doctorId        = $firstDocId
  appointmentDate = '2026-03-20'
  appointmentTime = '10:00'
  notes           = 'Checkup'
} | ConvertTo-Json

try {
  $appt = Invoke-RestMethod -Method Post -Uri ($base + '/appointments') -Headers @{ Authorization = ('Bearer ' + $patToken) } -ContentType 'application/json' -Body $book
} catch {
  $status = $_.Exception.Response.StatusCode.value__
  $body = $null
  try { $body = (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() } catch { }
  throw \"Book appointment failed. HTTP $status. Body: $body\"
}

$my = Invoke-RestMethod -Uri ($base + '/appointments/my') -Headers @{ Authorization = ('Bearer ' + $patToken) }

@{
  docEmail            = $docEmail
  patEmail            = $patEmail
  bookedAppointmentId = $appt.data.id
  myAppointmentsCount = @($my.data).Count
} | ConvertTo-Json -Compress

