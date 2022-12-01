import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./Modal.module.scss";

const Modal = ({
  setIsOpen,
  handleAddTask,
  taskInputValue,
  handleEditTask,
}) => {
  const fileInput = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [file, setFile] = useState("");

  useEffect(() => {
    if (taskInputValue) {
      setTitle(taskInputValue.title);
      setDescription(taskInputValue.description);
      setPriority(taskInputValue.priority);
      setFile(taskInputValue.file);
    }
  }, [taskInputValue]);

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const getDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleClick = () => {
    fileInput.current.click();
  };

  const handleChange = (event) => {
    const file = event.target.files[0];

    getDataURL(file).then((dataURL) => {
      setFile({ name: file.name, url: dataURL });
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    taskInputValue
      ? handleEditTask({ title, description, priority, file })
      : handleAddTask({ title, description, priority, file });
    setIsOpen(false);
    event.target.reset();
  };

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>
              {taskInputValue ? "Edit task" : "Add new task"}
            </h5>
          </div>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
            Close
          </button>
          <div className={styles.modalContent}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.label} htmlFor="title">
                Title:
              </label>
              <input
                className={styles.input}
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <label className={styles.label} htmlFor="description">
                Description:
              </label>
              <input
                className={styles.input}
                type="text"
                id="description"
                value={description}
                name="description"
                onChange={(event) => setDescription(event.target.value)}
              />
              <p className={styles.radioButtonsLabel}>Priority:</p>
              <div className={styles.radioButtons}>
                <input
                  type="radio"
                  id="low"
                  name="priority"
                  onChange={handlePriorityChange}
                  value={"low"}
                  checked={priority === "low"}
                />
                <label htmlFor="low">Low</label>
                <input
                  type="radio"
                  id="medium"
                  name="priority"
                  value="medium"
                  checked={priority === "medium"}
                  onChange={handlePriorityChange}
                />
                <label htmlFor="medium">Medium</label>
                <input
                  type="radio"
                  id="high"
                  name="priority"
                  value="high"
                  checked={priority === "high"}
                  onChange={handlePriorityChange}
                />
                <label htmlFor="high">High</label>
              </div>
              <div className={styles.upload}>
                <input
                  onChange={handleChange}
                  ref={fileInput}
                  type="file"
                  style={{ display: "none" }}
                />
                <button onClick={handleClick} type={"button"}>
                  Upload a file
                </button>
                <a href={file.url} download={file.name}>
                  {file.name}
                </a>
              </div>
              <input
                className={styles.primaryBtn}
                type="submit"
                value={taskInputValue ? "Edit task" : "Add new task"}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
  handleAddTask: PropTypes.func.isRequired,
  handleEditTask: PropTypes.func,
  taskInputValue: PropTypes.object,
};
Modal.defaultProps = {
  handleEditTask: null,
  taskInputValue: null,
};

export default Modal;
