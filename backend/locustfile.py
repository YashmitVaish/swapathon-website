from locust import HttpUser, task, between, events
from gevent import monkey; monkey.patch_all()
import json
import random
import websocket
import time
import threading

# -----------------------------------
# TEAM USER (HTTP ENDPOINTS)
# -----------------------------------

# class TeamUser(HttpUser):
#     wait_time = between(1, 5)

#     def on_start(self):
#         """Register and log in when a simulated team user starts"""
#         self.team_name = f"TestTeam_{random.randint(1000, 9999)}"
#         self.email = f"{self.team_name.lower()}@example.com"
#         self.password = "securepass123"

#         # 1️⃣ Register team
#         register_payload = {
#             "team_name": self.team_name,
#             "leader_name": "John Doe",
#             "email": self.email,
#             "password": self.password,
#             "problem_statement": "Build a web app for task management",
#             "members": "John Doe, Jane Smith"
#         }
#         self.client.post("/api/teams/register", json=register_payload, name="POST /api/teams/register")

#         # 2️⃣ Login team
#         login_payload = {"email": self.email, "password": self.password}
#         response = self.client.post("/api/teams/login", json=login_payload, name="POST /api/teams/login")

#         try:
#             self.token = response.json().get("token")
#         except Exception:
#             self.token = None

#         self.headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}

    # @task(2)
    # def list_problems(self):
    #     """Fetch list of available problems (public endpoint)"""
    #     self.client.get("/api/teams/listproblems", name="GET /api/teams/listproblems")

    # @task(1)
    # def get_team_data(self):
    #     """Fetch team data (protected endpoint)"""
    #     if self.token:
    #         self.client.get("/api/teams/get-data", headers=self.headers, name="GET /api/teams/get-data")

    # @task(1)
    # def submit_phase1(self):
    #     """Submit phase 1 solution (protected endpoint)"""
    #     if self.token:
    #         payload = {
    #             "problem": "Build a task management system",
    #             "sol1": "Solution 1: Use React for frontend",
    #             "sol2": "Solution 2: Use Node.js for backend",
    #             "sol3": "Solution 3: Use PostgreSQL database",
    #             "sol4": "Solution 4: Use Docker for deployment",
    #             "locked_index": random.randint(1, 4)
    #         }
    #         self.client.post("/api/submit/phase1", headers=self.headers, json=payload, name="POST /api/submit/phase1")


# -----------------------------------
# ADMIN USER (HTTP ENDPOINTS)
# -----------------------------------

# class AdminUser(HttpUser):
#     wait_time = between(5, 10)

#     def on_start(self):
#         """Login as admin"""
#         payload = {"username": "admin", "password": "adminpassword"}
#         response = self.client.post("/api/admin/login", json=payload, name="POST /api/admin/login")

#         try:
#             self.token = response.json().get("token")
#         except Exception:
#             self.token = None

#         self.headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}

#     @task(1)
#     def add_problem(self):
#         """Add a new problem statement"""
#         if self.token:
#             payload = {
#                 "problem": f"Design app {random.randint(1, 1000)}",
#                 "solution": "Use React Native for cross-platform"
#             }
#             self.client.post("/api/admin/add-problem", headers=self.headers, json=payload, name="POST /api/admin/add-problem")

#     @task(1)
#     def prepare_swaps(self):
#         """Trigger swap assignment"""
#         if self.token:
#             self.client.get("/api/admin/swap", headers=self.headers, name="GET /api/admin/swap")


# -----------------------------------
# WEBSOCKET TESTING USER
# -----------------------------------

class WebSocketUser(HttpUser):
    wait_time = between(10, 20)
    abstract = False

    def on_start(self):
        """Connect to the WebSocket endpoint"""
        self.ws_url = "ws://localhost:8080/api/teams/ws"
        self.ws = None

        def run_ws():
            try:
                self.ws = websocket.WebSocket()
                start_time = time.time()
                self.ws.connect(self.ws_url)
                events.request.fire(
                    request_type="WEBSOCKET",
                    name="WS Connect /api/teams/ws",
                    response_time=(time.time() - start_time) * 1000,
                    response_length=0,
                    exception=None,
                )

                # Listen for messages for a while
                start_listen = time.time()
                while time.time() - start_listen < 10:
                    msg = self.ws.recv()
                    if msg:
                        events.request.fire(
                            request_type="WEBSOCKET",
                            name="WS Receive Message",
                            response_time=(time.time() - start_listen) * 1000,
                            response_length=len(msg),
                            exception=None,
                        )
                        print(msg)
            except Exception as e:
                events.request.fire(
                    request_type="WEBSOCKET",
                    name="WS Connection Error",
                    response_time=0,
                    response_length=0,
                    exception=e,
                )
            finally:
                if self.ws:
                    self.ws.close()
                    events.request.fire(
                        request_type="WEBSOCKET",
                        name="WS Close /api/teams/ws",
                        response_time=0,
                        response_length=0,
                        exception=None,
                    )

        # Run in background thread so Locust can proceed
        threading.Thread(target=run_ws).start()

    @task
    def keep_alive(self):
        """Idle wait to simulate persistent connection"""
        time.sleep(random.uniform(5, 10))
