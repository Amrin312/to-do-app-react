import react, { useState } from 'react'
import { Trash2, SquarePen, Plus } from 'lucide-react';
import {useForm} from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function App() {

  const { register, handleSubmit, reset , formState: { errors } } = useForm();

  const [showModal, setShowModal] = useState(false);

  const [tasks, setTasks] = useState([]);

  const [edidId , setEditId] = useState(null);

  const closeModal = () => {
    reset({taskName: '', description: '', status: ''});
    setShowModal(false);
  }  

  const onSubmit = (data) => {
    let msg;

    if(edidId  != null){
      
      const taskdata = tasks.map((task, index) =>
         index === edidId  ? data : task
      );

      setTasks(taskdata);
      msg = "Task Updated successfully!";
    }else{     
      setTasks((prev) => [...prev, data]);
      msg = "Task Added successfully!"
    }
      toast.success(msg);
    setEditId(null);
    reset();
    setShowModal(false);
  }

  const handleEdit = (id) => {
    setEditId(id);
    const taskdata = tasks.find((task, index) => index == id);
    setShowModal(true);
    reset(taskdata); 
  }

  const handleDelete = (id) => {
    const taskData = tasks.filter((task, index) => index != id);
    setTasks(taskData);
    reset({taskName: '', description: '', status: ''});
    toast.success('Task deleted successfully!');
  }

  const handleOpenModal  = () => {
    setShowModal(true)
  }

const handleStatusToggle = (id) => {
  setTasks((prev) =>
    prev.map((task, index) =>
      index === id
        ? { ...task, status: task.status === 'Completed' ? 'In Progress' : 'Completed' }
        : task
    )
  );
};

  return (
    <div className="flex items-center flex-col h-screen rounded md:mx-auto w-full border lg:shadow-lg lg:shadow-black-900">
          <Toaster />

      <div className="w-full h-15 md:h-20 bg-teal-300 flex justify-between p-4 items-center">
        <h1 className="text-2xl lg:text-4xl text-white">To Do App</h1>
        <button onClick={handleOpenModal} className="p-1 lg:p-3 flex gap-1 rounded bg-white text-emerald"> <Plus /> Add Task</button>
      </div>

      <TableContainer component={Paper} sx={{ width: "90%", margin: "60px auto" }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="font-extrabold text-base">Task Name</TableCell>
                <TableCell className="font-extrabold">Task Description</TableCell>
                <TableCell className="font-extrabold">Task status</TableCell>
                <TableCell className="font-extrabold">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">
                      <div className="flex gap-5 justify-center items-center">
                        <input
                          type="checkbox"
                          className="checked:bg-blue-500 w-5 h-5"
                          checked={task["status"] === "Completed"}
                          onChange={() => handleStatusToggle(index)}
                        />
                        <div
                          className={
                            task["status"] === "Completed"
                              ? "line-through decoration-black-500 text-xl"
                              : "text-xl"
                          }
                        >
                          {task["taskName"]}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell align="left">{task["description"]}</TableCell>
                    <TableCell align="left">{task["status"]}</TableCell>
                    <TableCell align="left">
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(index)}
                          className="bg-yellow-400 text-white p-1 rounded hover:bg-yellow-500"
                        >
                          <SquarePen />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No tasks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
      </TableContainer>

      

      {showModal && (
        <div className="fixed bg-black/50 min-h-screen z-10 w-screen flex justify-center items-center">
            <div className="bg-white w-80 md:w-96 rounded p-4">

              <div className="flex justify-between mb-4">
                <h1 className="">Add Task</h1>
                <button className="" onClick={closeModal}>X</button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-2 mb-4">
                     <label>Task Name</label>
                     <input type="text" className="p-2 border rounded"
                      {...register('taskName', {
                        required : "Task name is mandatory!",
                        minLength: {value: 3, message:"Task name length must be minimum of 3."},
                        maxLength: {value: 50, message:"Task name length must be Maximum of 50."},
                      })}/>

                     {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName.message}</p>}
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                     <label>Task Description</label>
                     <textarea className="p-2 border rounded"
                      {...register('description', {
                        maxLength: {value: 100, message:"Task name length must be Maximum of 100."},
                      })} />

                     {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                     <label>Task status</label>
                     <select className="p-2 border rounded"
                     {...register('status', {
                      required: "Status is mandatory!"
                     })}>
                        <option value="" >Select Status</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress" >In Progress</option>
                        <option value="Completed" >Completed</option>
                     </select>
                     {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}

                  </div>

                  <div className="flex justify-end gap-2 mt-8">
                    <button type="button" className="bg-red-800 rounded py-1 px-2 text-white hover:bg-red-600" onClick={closeModal}>cancel</button>
                    <button type="submit" className="bg-green-800 hover:bg-green-700 rounded py-1 px-2 text-white">save</button>
                  </div>
              </form>
            </div>
        </div>
      )}

    </div>
    
  )
}

export default App
