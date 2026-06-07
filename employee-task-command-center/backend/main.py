from datetime import date
from typing import Literal, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(title="Employee Task Command Center API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class EmployeeIn(BaseModel):
    name: str = Field(min_length=1)
    employee_id: str = Field(min_length=1)
    department: str = Field(min_length=1)
    email: EmailStr
    role: str = Field(min_length=1)


class Employee(EmployeeIn):
    id: str


class TaskIn(BaseModel):
    employee_id: str
    title: str = Field(min_length=1)
    description: str = ""
    assigned_date: date
    due_date: date
    priority: Literal["Low", "Medium", "High"]
    status: Literal["Pending", "In Progress", "Completed"] = "Pending"


class Task(TaskIn):
    id: str


class TaskStatusUpdate(BaseModel):
    status: Literal["Pending", "In Progress", "Completed"]


# ---------------------------------------------------------------------------
# In-memory storage
# ---------------------------------------------------------------------------
employees: list[dict] = []
tasks: list[dict] = []


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def find_employee(employee_id: str) -> Optional[dict]:
    return next((e for e in employees if e["id"] == employee_id), None)


def find_task(task_id: str) -> Optional[dict]:
    return next((t for t in tasks if t["id"] == task_id), None)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/")
def root():
    return {"status": "ok", "service": "Employee Task Command Center API"}


@app.post("/employees", status_code=201)
def add_employee(payload: EmployeeIn):
    if any(e["employee_id"] == payload.employee_id for e in employees):
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    record = {"id": str(uuid4()), **payload.model_dump()}
    employees.append(record)
    return {"message": "Employee added successfully", "employee": record}


@app.get("/employees")
def get_employees():
    return employees


@app.post("/tasks", status_code=201)
def assign_task(payload: TaskIn):
    if not find_employee(payload.employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")
    record = {"id": str(uuid4()), **payload.model_dump()}
    tasks.append(record)
    return {"message": "Task assigned successfully", "task": record}


@app.get("/tasks")
def get_tasks():
    return tasks


@app.get("/tasks/{employee_id}")
def get_tasks_for_employee(employee_id: str):
    if not find_employee(employee_id):
        raise HTTPException(status_code=404, detail="Employee not found")
    return [t for t in tasks if t["employee_id"] == employee_id]


@app.put("/tasks/{task_id}")
def update_task_status(task_id: str, payload: TaskStatusUpdate):
    task = find_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task["status"] = payload.status
    return {"message": "Task status updated", "task": task}


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    task = find_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    tasks.remove(task)
    return {"message": "Task deleted successfully"}
