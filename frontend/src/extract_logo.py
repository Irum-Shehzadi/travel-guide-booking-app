from PIL import Image

try:
    img_path = r'e:\fyp-1\frontend\src\assets\logo.png'
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    bg_color = datas[0]
    print(f"Image size: {img.size}")
    print(f"Background color guess (top-left): {bg_color}")
    
    newData = []
    # Identify background correctly
    for item in datas:
        # Check tolerance (if pixel is close to background)
        if abs(item[0]-bg_color[0])<20 and abs(item[1]-bg_color[1])<20 and abs(item[2]-bg_color[2])<20:
            newData.append((255, 255, 255, 0)) # Make transparent
        else:
            newData.append(item)
            
    img.putdata(newData)
    
    # Save the transparent logo
    out_path = r'e:\fyp-1\frontend\src\assets\logo_transparent.png'
    img.save(out_path, "PNG")
    print("Saved transparent logo successfully as logo_transparent.png")
except Exception as e:
    print(f"Error: {e}")
