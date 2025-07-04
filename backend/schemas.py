from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str 
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class FavoriteCreate(BaseModel):
    title: str
    anime_id: str

class FavoriteOut(BaseModel):  
    id: int
    user_id: int
    anime_id: int

    class Config:
        from_attributes = True

