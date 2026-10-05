// jsdom has HTMLDialogElement but not showModal/close. These stand-ins toggle
// `open` and fire the close event, which is all the components rely on.
// (Route handler tests run in the node environment, which has no DOM.)
if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}
