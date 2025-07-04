from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional
import models
from passlib.context import CryptContext
import schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_user_by_username(db: Session, username: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user) -> models.User:
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)



def create_favorite(db: Session, favorite: schemas.FavoriteCreate, user_id: int):
    db_favorite = models.Favorite(
        title=favorite.title,
        anime_id=favorite.anime_id,
        user_id=user_id,
    )
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    return db_favorite

def get_favorite(db: Session, favorite_id: int, user_id: int) -> Optional[models.Favorite]:
    return db.query(models.Favorite).filter_by(id=favorite_id, user_id=user_id).first()

def delete_favorite_by_anime_id(db: Session, anime_id: str, user_id: int):
    favorite = db.query(models.Favorite).filter(
        models.Favorite.anime_id == anime_id,
        models.Favorite.user_id == user_id
    ).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")

    db.delete(favorite)
    db.commit()
    return {"detail": "Favorite removed successfully"}


def get_favorites_by_user(db: Session, user_id: int):
    return db.query(models.Favorite).filter(models.Favorite.user_id == user_id).all()
