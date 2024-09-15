// Simulate log data (you will pull real data via APIs or backend)
const logs = [
    { fileName: 'example.pdf', user: 'User1', date: '2024-09-15' },
    { fileName: 'example.pdf', user: 'User2', date: '2024-09-14' }
  ];
  
  // Inject logs into table
  const logsTable = document.getElementById('logs-table').getElementsByTagName('tbody')[0];
  
  logs.forEach(log => {
    const row = logsTable.insertRow();
    row.insertCell(0).textContent = log.fileName;
    row.insertCell(1).textContent = log.user;
    row.insertCell(2).textContent = log.date;
  });
  
  // Handle settings (you can save these settings in local storage or send to backend)
  document.getElementById('download-limit').addEventListener('input', function () {
    const limit = this.value;
    console.log(`Download limit set to: ${limit}`);
  });
  
  document.getElementById('rate
  