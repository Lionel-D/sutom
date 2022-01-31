export default class NotificationMessage {
  private static _notificationArea: HTMLElement = document.getElementById("notification") as HTMLElement;
  private static _notificationPanelArea: HTMLElement = document.getElementById("panel-fenetre-notification") as HTMLElement;
  private static _currentTimeout: NodeJS.Timeout | undefined;
  public static ajouterNotification(message: string): void {
    this.ajouterNotificationDiv(this._notificationArea, message);
  }

  public static ajouterNotificationPanel(message: string): void {
    this.ajouterNotificationDiv(this._notificationPanelArea, message);
  }

  private static ajouterNotificationDiv(div: HTMLElement, message: string): void {
    if (this._currentTimeout) {
      clearTimeout(this._currentTimeout);
      this._currentTimeout = undefined;
    }
    div.innerHTML = message;
    div.style.opacity = "1";
    this._currentTimeout = setTimeout(
      (() => {
        div.style.opacity = "0";
        this._currentTimeout = setTimeout(
          (() => {
            div.innerHTML = " ";
            this._currentTimeout = undefined;
          }).bind(this),
          1000
        );
      }).bind(this),
      5000
    );
  }
}
