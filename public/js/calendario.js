document.addEventListener("DOMContentLoaded", function () {
    let datepicker = document.getElementById("datepicker");

    function setValidFridays() {
        let today = new Date();
        let pastLimit = new Date();
        pastLimit.setFullYear(today.getFullYear() - 1); // Define um limite para 1 ano no passado

        // Encontrar a sexta-feira mais próxima no passado
        while (pastLimit.getDay() !== 5) {
            pastLimit.setDate(pastLimit.getDate() - 1);
        }

        // Encontrar a próxima sexta-feira
        while (today.getDay() !== 5) {
            today.setDate(today.getDate() + 1);
        }

        // Formatar datas para YYYY-MM-DD
        let minDate = pastLimit.toISOString().split("T")[0];
        let startDate = today.toISOString().split("T")[0];

        datepicker.setAttribute("min", minDate);
        datepicker.setAttribute("value", startDate);
        datepicker.setAttribute("step", "7"); // Faz com que apenas sextas sejam escolhidas automaticamente
    }

    setValidFridays();
});