# FinanceControl — Veiligheidsverificatie

We distribueren Finance.Control als een ingepakte `.zip` map. Dit voorkomt 
vals-positieve "Malware/AI" meldingen bij virusscanners, doordat de app
zich niet zelf hoeft uit te pakken op de achtergrond.

## Stap 1: Controleer dat je de originele .zip hebt

Open PowerShell in de map waar `FinanceControl.zip` staat en run:

```powershell
Get-FileHash .\FinanceControl.zip -Algorithm SHA256
```

De output moet exact deze hash zijn:

```
DFA60E14D9A3F2685BB2CF4B84E698F5A0F9CA7767C509BF00FBE83C6484BCCB
```

## Stap 2: Verifieer de veiligheid via VirusTotal

Zoek deze hash op bij VirusTotal om het onafhankelijke scanrapport te bekijken:

🔗 https://www.virustotal.com/gui/file/DFA60E14D9A3F2685BB2CF4B84E698F5A0F9CA7767C509BF00FBE83C6484BCCB

Als de hash uit Stap 1 overeenkomt, kijk je naar exact hetzelfde bestand dat
door VirusTotal is gescand. Het rapport bevestigt dat het bestand door
antivirusengines als veilig is beoordeeld (verwacht: 0/70).
