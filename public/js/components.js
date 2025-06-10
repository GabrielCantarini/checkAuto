document.addEventListener("alpine:init", () => {
    Alpine.data("menu", () => ({
        open: false,
        init() {
            console.log("Menu inicializado!");
        },
        onButtonClick() {
            this.open = !this.open;
        },
        onButtonEnter() {
            this.open = true;
        },
        focusButton() {
            this.$refs.button.focus();
        },
        onClickAway(event) {
            this.open = false;
        },
        onArrowUp() {
            console.log("Seta para cima pressionada");
        },
        onArrowDown() {
            console.log("Seta para baixo pressionada");
        },
        onMouseEnter(event) {
            console.log("Mouse entrou no item do menu");
        },
        onMouseMove(event, index) {
            console.log("Mouse se moveu dentro do menu, index:", index);
        },
        onMouseLeave(event) {
            console.log("Mouse saiu do item do menu");
        }
    }));
});
