import React, { useState } from 'react'
import styles from './SetttingsBook.module.scss'
import BaseModal from '../BaseModal/BaseModal';
import ModalSetttings from './ModalSetttings';

interface PropsSettingsBook {
  onSaveBookMark: () => void;
}

const SettingsBook = (props: PropsSettingsBook) => {

  const [showModal, setShowModal] = useState<boolean>(false);


  return (
    <>
      <div
        className={`position-absolute d-flex pe-3 pt-3 ${styles.container}`}
      >
        <div className='pe-3' onClick={props.onSaveBookMark}>
          <i className={`fa fa-bookmark fs-4 ${styles.iconSettings}`}></i>
        </div>
        <div onClick={() => setShowModal(true)}>
          <i className={`fa fa-gear fs-4 ${styles.iconSettings}`}></i>
        </div>

      </div>


      <BaseModal
        size="md"
        scrollable
        className="h-50"
        fullscreen=""
        centered={true}
        show={showModal}
        onHide={() => setShowModal(false)}
      >
        <ModalSetttings />
      </BaseModal>
    </>
  )
}

export default SettingsBook;