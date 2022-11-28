import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Projects.module.scss";

const Projects = () => {
  const [projects, setProjects] = useState(
    JSON.parse(localStorage.getItem("projects")) || []
  );
  const [message, setMessage] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    const projectsArr = [...projects];
    projectsArr.push({
      title: message || "New project",
      id: String(projectsArr.length + 1),
      tasks: null,
    });
    setProjects(projectsArr);
    setMessage("");
  };

  const removeProject = (e) => {
    e.stopPropagation();
    const projectsArr = projects.filter(
      (project) => project.id !== e.currentTarget.id
    );
    setProjects(projectsArr);
  };

  const handleChangeInput = (event) => {
    setMessage(event.target.value);
  };

  const Project = ({ title, id }) => {
    const navigate = useNavigate();

    return (
      <div
        className={styles.project}
        onClick={(event) => {
          navigate(`/${id}`);
        }}
      >
        <h3>{title}</h3>
        <button
          ref={ref}
          className={styles.removeButton}
          id={id}
          onClick={removeProject}
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <h1>Projects</h1>
      <div className={styles.inputRow}>
        <input
          type="text"
          id="title"
          name="title"
          onChange={handleChangeInput}
          value={message}
          placeholder={"Title"}
        />
        <button className={styles.primaryBtn} onClick={addProject}>
          Add project
        </button>
      </div>
      <div className={styles.projects}>
        {projects.map((project) => (
          <Project key={project.id} title={project.title} id={project.id} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
