export default class NotificationMessage {
  private static _notificationArea: HTMLElement = document.getElementById("notification") as HTMLElement;
  private static _currentTimeout: NodeJS.Timeout | undefined;
  public static ajouterNotification(message: string): void {
    if (this._currentTimeout) {
      clearTimeout(this._currentTimeout);
      this._currentTimeout = undefined;
    }
    this._notificationArea.innerHTML = message;
    this._notificationArea.style.opacity = "1";
    this._currentTimeout = setTimeout(
      (() => {
        this._notificationArea.style.opacity = "0";
        this._notificationArea.innerHTML = "";
        this._currentTimeout = undefined;
      }).bind(this),
      5000
    );
  }
}
