"""
Configuration settings for the face recognition system.
"""

import os

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "face_db.pkl")
FAISS_DB_PATH = os.path.join(DATA_DIR, "face_db_faiss.bin")
FAISS_LABELS_PATH = os.path.join(DATA_DIR, "face_db_labels.pkl")
LOG_DIR = os.path.join(BASE_DIR, "logs")

# Face Detection and Recognition
DETECTION_THRESHOLD = 0.5  # Slightly higher threshold for the smaller model
RECOGNITION_THRESHOLD = 0.4  # Adjusted threshold for buffalo_s cosine similarity
USE_FAISS = False  # Whether to use FAISS for database operations
MODEL_NAME = "buffalo_s"  # Lighter model (MobileFaceNet) for CPU performance
IS_PRODUCTION = os.environ.get("PRODUCTION", "false").lower() == "true"

# Face Detection Context
DET_SIZE = (640, 640)  # Detection size
CTX_ID = -1  # 0 for GPU, -1 for CPU

# Image Processing
FRAME_WIDTH = 640
FRAME_HEIGHT = 480

# Alert System
CRIMINAL_KEYWORDS = [
    "murder",
    "murderer",
    "killer",
    "homicide",
    "assassin",
    "terrorist",
    "rapist",
    "kidnapper",
    "abductor",
    "felon",
]
ALERT_PHONE_NUMBER = "918299810917"

# Initialize directories
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)
