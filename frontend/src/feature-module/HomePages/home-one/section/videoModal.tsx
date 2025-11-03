import { Modal } from 'react-bootstrap';
import ReactPlayer from 'react-player';

interface ModalsProps {
  show: boolean;
  handleClose: () => void;
  videoUrl: string;
}

const VideoModal = ({ show, handleClose, videoUrl }: ModalsProps) => {
  return (
    <Modal className="video-modal" show={show} centered size="xl" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ReactPlayer src={videoUrl} playing controls width="100%" height="80vh" />
      </Modal.Body>
    </Modal>
  );
};

export default VideoModal;
