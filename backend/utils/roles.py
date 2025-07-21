from fastapi import Header, HTTPException

# Simple role-based permission system
role_permissions = {
    "Admin": {"upload", "transform", "verify", "view"},
    "Analyst": {"transform", "verify", "view"},
    "Viewer": {"view"},
}

def authorize_action(role: str, action: str):
    if role not in role_permissions:
        raise HTTPException(status_code=403, detail=f"Unknown role: {role}")
    if action not in role_permissions[role]:
        raise HTTPException(status_code=403, detail=f"Role '{role}' not permitted to perform '{action}'")
