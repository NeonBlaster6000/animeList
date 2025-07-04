from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import auth
import crud
import models
import schemas
from database import Base, SessionLocal, engine
from typing import List
from fastapi import Query


Base.metadata.create_all(bind=engine)
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = crud.create_user(db, user)
    return new_user

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)
    if not db_user or not crud.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    access_token = auth.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/favorites", response_model=schemas.FavoriteOut)
def add_favorite(
    favorite: schemas.FavoriteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.create_favorite(db, favorite, current_user.id)



@app.delete("/favorites")
def remove_favorite(
    anime_id: str = Query(..., description="ID of the anime to remove from favorites"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return crud.delete_favorite_by_anime_id(db, anime_id, current_user.id)



@app.get("/favorites", response_model=List[schemas.FavoriteOut])
def get_favorites(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    favorites = crud.get_favorites_by_user(db, current_user.id)
    return favorites