import React from 'react';

const Modal = ({ onConfirm,  onCancel })=> {
  return (
    <div id="myModal" className="modal show" role="dialog">
    <div className="modal-dialog">

      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal">&times;</button>
          <h4 className="modal-title">Confirm</h4>
        </div>
        <div className="modal-body">
          <p>Are you sure?</p>
        </div>
        <div className="modal-footer">
          <button type="button" onClick={ onConfirm } className="btn btn-primary" data-dismiss="modal">Yes</button>
          <button type="button" onClick={ onCancel } className="btn btn-default" data-dismiss="modal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Modal;
