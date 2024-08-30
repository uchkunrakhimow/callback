import { Modal, Button } from "rsuite";

const ConfirmationModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      backdrop="static"
      role="alertdialog"
      open={open}
      onClose={onClose}
      size="xs"
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: "5rem",
      }}
    >
      <Modal.Body style={{ padding: "0 2rem 1.5rem 1.5rem" }}>
        <h5>⚠️ Вы уверены ?</h5>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onConfirm} appearance="primary">
          Да
        </Button>
        <Button onClick={onClose}>
          Нет
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { ConfirmationModal };
