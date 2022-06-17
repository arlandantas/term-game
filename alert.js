const alertDiv = document.querySelector("#alert");
const alertBtCancel = document.querySelector("#alert #bt_cancel");
const alertBtOk = document.querySelector("#alert #bt_ok");
const alertTitle = document.querySelector("#alert #title");
const alertContent = document.querySelector("#alert #content");
let alertOnOk = () => null;
let alertOnCancel = () => null;

alertBtOk.onclick = () => {
    hideAlert()
    alertOnOk()
}

alertBtCancel.onclick = () => {
    hideAlert()
    alertOnCancel()
}

function hideAlert() {
    alertDiv.style.display = 'none';
}

function showAlert(
    message,
    title = null,
    onOk = null,
    onCancel = null,
    okText = 'OK',
    cancelText = 'Cancelar',
) {
    alertContent.innerHTML = message;
    alertTitle.innerHTML = title ? title : '';
    alertOnOk = onOk ? onOk : (() => null);
    alertOnCancel = onCancel ? onCancel : (() => null);
    alertBtCancel.style.display = onCancel ? '' : 'none';
    alertBtOk.innerHTML = okText;
    alertBtCancel.innerHTML = cancelText;
    alertDiv.style.display = 'flex';
}
