// For histogram chart
window.onload = async function() {
    const response = await fetch("/comments-per-day");
    const {labels, data} = await response.json();
    const ctx = document.getElementById('histogram-chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Comments per day',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0.5
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks:{
                        stepSize: 1
                    }
                },
            }
        }
    });
}
