import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import * as dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocation } from "react-router-dom";

import Modal from "../../components/modal/Modal";

import styles from "./Tasks.module.scss";

dayjs.extend(relativeTime);

const STATUSES = {
  pending: "pending",
  inProgress: "in progress",
  completed: "completed",
};

const STATUSES_BY_COLUMN = {
  queue: STATUSES.pending,
  development: STATUSES.inProgress,
  done: STATUSES.completed,
};

const Tasks = () => {
  const location = useLocation();
  const projectId = location.pathname.replace(/^\D+/g, "");

  const dataStorage = JSON.parse(localStorage.getItem("projects"));
  const targetIndex = dataStorage.findIndex((item) => item.id === projectId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeArray, setTimeArray] = useState(null);
  const [state, setState] = useState(
    dataStorage[targetIndex].tasks || {
      queue: {
        title: "Queue",
        items: [],
      },
      development: {
        title: "Development",
        items: [],
      },
      done: {
        title: "Done",
        items: [],
      },
    }
  );

  const addItem = (data) => {
    setState((prev) => {
      return {
        ...prev,
        queue: {
          title: "Queue",
          items: [
            {
              id: String(
                state.queue.items.length +
                  state.development.items.length +
                  state.done.items.length +
                  1
              ),
              name: data.title || "New task",
              description: data.description,
              status: "pending",
              priority: data.priority,
              createdOn: dayjs().format("MMM D, YYYY HH:mm"),
              startedAt: null,
              file: data.file,
            },
            ...prev.queue.items,
          ],
        },
      };
    });
  };

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) {
      return;
    }

    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    // Creating a copy of item before removing it from state
    const itemCopy = { ...state[source.droppableId].items[source.index] };
    itemCopy.status = STATUSES_BY_COLUMN[destination.droppableId];

    if (itemCopy.status === STATUSES.inProgress) {
      itemCopy.startedAt = dayjs().format("MMM D, YYYY HH:mm");
    }

    if (itemCopy.status === STATUSES.completed) {
      itemCopy.completedAt = dayjs().format("MMM D, YYYY HH:mm");
    }

    setState((prev) => {
      prev = { ...prev };
      // Remove from previous items array
      prev[source.droppableId].items.splice(source.index, 1);

      // Adding to new items array location
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  const getTimeForTasks = (tasksArr) =>
    tasksArr.map((task) => {
      return {
        id: task.id,
        time: dayjs().from(dayjs(task?.startedAt), true),
      };
    });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeArray(getTimeForTasks(state?.development?.items));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dataStorage[targetIndex].tasks = state;
    localStorage.setItem("projects", JSON.stringify(dataStorage));
  }, [state]);

  return (
    <div className={styles.wrapper}>
      <div>
        <button
          className={styles.primaryBtn}
          onClick={() => setIsModalOpen(true)}
        >
          Add new task
        </button>
      </div>
      <div className={styles.tasksContainer}>
        {isModalOpen && (
          <Modal setIsOpen={setIsModalOpen} handleAddTask={addItem} />
        )}
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.keys(state).map((key) => {
            return (
              <div className={styles.column} key={key}>
                <h3>{state[key].title}</h3>
                <Droppable droppableId={key}>
                  {(provided) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={styles.droppableColumn}
                      >
                        {state[key].items.map((el, index) => {
                          const time = timeArray?.find((task) => {
                            return task.id === el.id;
                          })?.time;

                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided) => {
                                return (
                                  <div
                                    className={styles.task}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className={styles.title}>
                                      {el.name}
                                    </div>
                                    <div className={styles.description}>
                                      {el.description}
                                    </div>
                                    <div
                                      className={styles.properties}
                                    >{`Number: ${el.id}`}</div>
                                    <div
                                      className={styles.properties}
                                    >{`Status: ${el.status}`}</div>
                                    <div
                                      className={styles.properties}
                                    >{`Created: ${el.createdOn}`}</div>
                                    <div
                                      className={styles.properties}
                                    >{`Priority: ${el.priority}`}</div>

                                    {time && key === "development" && (
                                      <div
                                        className={styles.properties}
                                      >{`Time in progress: ${time}`}</div>
                                    )}
                                    {key === "done" && (
                                      <>
                                        <div
                                          className={styles.properties}
                                        >{`Completed: ${el.completedAt}`}</div>
                                        <div
                                          className={styles.properties}
                                        >{`Time in progress: ${
                                          el.startedAt
                                            ? `${dayjs(el.completedAt).from(
                                                dayjs(el.startedAt),
                                                true
                                              )}`
                                            : " 🚀"
                                        } `}</div>
                                      </>
                                    )}
                                    {el.file && (
                                      <a
                                        href={el.file.url}
                                        download={`${el.file.name}`}
                                      >
                                        <img
                                          className={styles.image}
                                          src={el.file.url}
                                          alt="preview"
                                        />
                                      </a>
                                    )}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Tasks;
