from PIL import Image
import os

try:
    img_path = r'C:\Users\computers\.gemini\antigravity\brain\4ac24f27-5aef-40ac-8e95-01046fe5e1ce\new_travel_logo_1772805197267.png'
    out_path = r'e:\fyp-1\frontend\src\assets\logo_transparent.png'
    
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()
    
    # We will assume background is near black #000000 since it was generated with 'solid dark black' prompt
    bg_color = (0, 0, 0)
    
    newData = []
    for item in datas:
        # Calculate luma or average to find dark pixels
        r, g, b, a = item
        luma = 0.299 * r + 0.587 * g + 0.114 * b
        if luma < 30: # Threshold for darkness
            # Soft blending based on luma to avoid jagged edges
            alpha = int((luma / 30) * 255)
            newData.append((r, g, b, alpha))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(out_path, "PNG")
    print("New vibrant logo saved with transparent background!")
except Exception as e:
    print(f"Error: {e}")
