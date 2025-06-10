document.addEventListener("alpine:init", () => {
    Alpine.data("menu", () => ({
        open: false,

        init() {
            console.log("Menu inicializado!");
        },

        onButtonClick() {
            this.open = !this.open;
            console.log("Botão clicado, estado:", this.open);
        },

        focusButton() {
            if (this.$refs.button) {
                this.$refs.button.focus();
            }
        },

        onClickAway(event) {
            if (this.$refs.menu && !this.$refs.menu.contains(event.target)) {
                this.open = false;
            }
        }
    }));
});
