import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./Dashboard.module.css";
import Tasks from "../tasks/Tasks";
import { moveEnterGroup } from "../../store/board-actions";
import { fetchGroupData, pushGroupToBoard } from "../../store/board-actions";

const Dashboard = () => {
  const dispatch = useDispatch();
  const taskListInputRef = useRef();
  const [enterTaskList, setEnterTaskList] = useState(false);
  const taskList = useSelector((state) => state.board.groups);
  const boardId = useSelector((state) => state.board._id);

  useEffect(() => {
    dispatch(fetchGroupData(boardId));
  }, [dispatch, boardId]);

  const openAddTaskListHandler = () => {
    setEnterTaskList(true);
  };
  const closeAddTaskListHandler = () => {
    setEnterTaskList(false);
  };

  const addTaskListHandler = async () => {
    dispatch(pushGroupToBoard(taskListInputRef.current.value, boardId));
    setEnterTaskList(false);
  };

  const dragItem = useRef();
  const dragItemNode = useRef();
  const [dragging, setDragging] = useState(false);

  const dragStartHandler = (e, item) => {
    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener("dragend", dragEndHandler);
    dragItem.current = item;

    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const dragEnterHandler = (e, targetItem) => {
    if (dragItemNode.current !== e.target) {
      dispatch(
        moveEnterGroup({
          dragItem: {
            cardName: dragItem.current.taskName,
            groupId: dragItem.current.tasksId,
            groupIndex: dragItem.current.tasksIndex,
            cardId: dragItem.current.taskId,
            cardIndex: dragItem.current.taskIndex,
          },
          targetItem: {
            cardName: targetItem.taskName,
            groupId: targetItem.tasksId,
            groupIndex: targetItem.tasksIndex,
            cardId: targetItem.taskId,
            cardIndex: targetItem.taskIndex,
          },
        })
      );
      dragItem.current = targetItem;
    }
  };

  const dragEndHandler = (e) => {
    setDragging(false);
    dragItem.current = null;
    dragItemNode.current.removeEventListener("dragend", dragEndHandler);
    dragItemNode.current = null;
    setTimeout(() => { }, 100)

  };

  const onDraggingHandler = (item) => {
    if (
      dragItem.current.tasksIndex === item.tasksIndex &&
      dragItem.current.taskIndex === item.taskIndex
    ) {
      return "drag";
    }
    return "";
  };

  const dashboard = taskList.map((item, itemIndex) => {
    return (
      <Tasks
        key={item._id}
        id={item._id}
        tasksIndex={itemIndex}
        isDrag={dragging}
        onDragStart={dragStartHandler}
        onDragging={onDraggingHandler}
        onDragEnter={dragEnterHandler}
      />
    );
  });

  const EnterTaskListForm = () => {
    return (
      <div className={styles["form-content"]}>
        <div className={styles["form-control"]}>
          <label htmlFor="value">Enter Value:</label>
          <input type="text" id="title" ref={taskListInputRef} />
        </div>

        <div className={styles["form-actions"]}>
          <button type="button" onClick={closeAddTaskListHandler}>
            Close
          </button>
          <button onClick={addTaskListHandler}> Save </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles["dashboard"]}>
      {dashboard}
      {enterTaskList && <EnterTaskListForm />}
      {!enterTaskList && (
        <button
          className={styles["dash-button"]}
          onClick={openAddTaskListHandler}
        >
          Add another list
        </button>
      )}
    </div>
  );
};

export default Dashboard;
