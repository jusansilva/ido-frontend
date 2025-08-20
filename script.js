document.addEventListener('DOMContentLoaded', () => {
    const donationForm = document.getElementById('donationForm');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    // Dados da campanha (simulados)
    const totalGoal = 10000;
    let currentRaised = 3000;
    
    // Atualiza o progresso inicial
    updateProgressBar();
    
    donationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const donationAmount = parseFloat(document.getElementById('donationAmount').value);
        
        if (isNaN(donationAmount) || donationAmount <= 0) {
            alert('Por favor, insira um valor de doação válido.');
            return;
        }
        
        // Simula a doação
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        
        // Simulação de processamento
        console.log(`Doação de R$ ${donationAmount.toFixed(2)} via ${paymentMethod} processada.`);
        
        // Atualiza os valores da barra de progresso
        currentRaised += donationAmount;
        
        // Garante que o valor não exceda a meta
        if (currentRaised > totalGoal) {
            currentRaised = totalGoal;
        }
        
        updateProgressBar();
        
        // Exibe uma mensagem de sucesso
        const successMessage = `Obrigado por sua doação de R$ ${donationAmount.toFixed(2)}! Sua ajuda faz a diferença.`;
        alert(successMessage);
        
        // Resetar o formulário
        donationForm.reset();
    });
    
    function updateProgressBar() {
        const percentage = (currentRaised / totalGoal) * 100;
        progressBar.style.width = `${percentage}%`;
        progressText.innerHTML = `<strong>R$ ${currentRaised.toLocaleString('pt-BR')}</strong> de R$ ${totalGoal.toLocaleString('pt-BR')} arrecadados`;
    }
});