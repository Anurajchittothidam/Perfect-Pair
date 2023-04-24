
magnify_area.addEventListener('mousemove', function(event) {
    clientX = event.clientX - magnify_area.offsetLeft;
    clientY = event.clientY - magnify_area.offsetTop;
  
    mWidth = magnify_area.offsetWidth;
    mHeight = magnify_area.offsetHeight;
  
    // calculate the minimum and maximum values for clientX and clientY
    var minX = mWidth * 0.05;
    var maxX = mWidth * 0.95;
    var minY = mHeight * 0.05;
    var maxY = mHeight * 0.95;
    
  
    // clamp clientX and clientY to the range [minX, maxX] and [minY, maxY]
    clientX = Math.min(Math.max(clientX, minX), maxX);
    clientY = Math.min(Math.max(clientY, minY), maxY);
  
    clientX = clientX / mWidth * 100;
    clientY = clientY / mHeight * 100;
  
    magnify_img.style.transform = 'translate(-' + clientX + '%,-' + clientY + '%) scale(2)';
  });
  
  magnify_area.addEventListener('mouseleave', function() {
    magnify_img.style.transform = 'translate(-50%,-50%) scale(1)';
  });
  


