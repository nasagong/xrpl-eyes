const URL = "http://localhost:8080/api";

const API = {
    // POST : Register
    register: async (id, password) => {
        try {
            const response = await fetch(`${URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "회원가입 실패");
        }

        return data;
        } catch(error) {
            console.error("회원가입 에러:", error.message);
            throw error;
        }
    },

    // POST : Login
    login: async (id, password) => {
        try {
            const response = await fetch(`${URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "로그인 실패");
        }

        const token = data.data._id;
        localStorage.setItem("token", token);
        console.log("로그인 성공 token 저장 완료");
        return data;
        } catch(error) {
            console.error("로그인 에러:", error.message);
            throw error;
        }
    },

    // GET : User
    getUser: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("토큰이 없음");
            return null;
        }

        try {
            const response = await fetch(`${URL}/user/${token}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("인증 실패");
            }

            const data = await response.json();
            console.log("user profile : ", data);
            return data;
        } catch(error) {
            console.error("GET user 에러: ", error.message);
            throw error;
        }
    },

    //PATCH : user
    patchUser: async (grade, sequence, color1, color2, color3) => {
        try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("토큰이 없음");
            throw new Error("토큰이 없습니다. 다시 로그인해주세요.");
        }

        const response = await fetch(`${URL}/user/${token}`,{
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                card: {
                    grade: grade,
                    sequence: sequence,
                    color1: color1,
                    color2: color2,
                    color3: color3,
                }
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to patch user");
        }
        
        console.log("카드 업데이트 성공:", data);
        return data;
        } catch (error) {
            console.error("failed to patch user: ", error.message);
            throw error;
        }
    },

    // logout
    logout: () => {
        localStorage.removeItem("token");
        console.log("로그아웃 완료");
    },

    // 토큰 검증
    tokenValidity: () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("토큰 없음. 로그아웃 상태 유지");
            return false;
        }

        return true;
    },

    // GET Apps
    applist: async () => {
        try {
            console.log("Attempting to fetch apps from:", `${URL}/apps`);
            const response = await fetch(`${URL}/apps`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Response status:", response.status);
            console.log("Response ok:", response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Response error text:", errorText);
                throw new Error(`Failed to Get AppList response: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Apps data received:", data);
            return data;
        } catch (error) {
            console.error("Failed to Get Applist:", error.message);
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                console.error("Network error - please check if the server is running at", URL/apps);
            }
            throw error;
        }
    },

    // GET : Notices
    notices: async () => {
        try {
            const response = await fetch(`${URL}/notices`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to notice response");
            };

            return data;
            
        } catch (error) {
            console.error("Failed to Get Notices: ", error.message);
            throw error;
        }
    },

    //xrpl UAW
    xrplUAW: async () => {
        try{
            const response = await fetch(`${URL}/apps`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "UAW 불러오기 실패");
            };
            return data;
        } catch (error) {
            console.error("UAW 불러오기 실패: ", error.message);
            throw error;
        }
    },

};

export default API;