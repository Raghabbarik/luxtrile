from PIL import Image
import os

# Define icon sizes for Android
sizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

# Load the original logo
logo_path = 'logo.png'
img = Image.open(logo_path)

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Generate icons for each size
for folder, size in sizes.items():
    # Create output directory
    output_dir = f'android/app/src/main/res/{folder}'
    os.makedirs(output_dir, exist_ok=True)
    
    # Resize image
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Save launcher icon
    resized.save(f'{output_dir}/ic_launcher.png', 'PNG')
    
    # For round icon, create a circular mask
    mask = Image.new('L', (size, size), 0)
    from PIL import ImageDraw
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    # Apply mask to create round icon
    round_icon = resized.copy()
    round_icon.putalpha(mask)
    round_icon.save(f'{output_dir}/ic_launcher_round.png', 'PNG')
    
    print(f'Generated icons for {folder}')

print('All icons generated successfully!')
