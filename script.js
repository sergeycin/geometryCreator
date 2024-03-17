const { createApp, ref, reactive } = Vue;

createApp({
    setup() {
        // Reactive state to keep track of clicked points
        const clickedPoints = reactive([]);
        // Define state as a reactive object
        const circle = reactive({});

        const state = reactive({
            draggedPointIndex: null
        });

        // Function to handle mouse clicks
        const handleClick = (event) => {
            // Check if less than 3 points have been painted
            if (clickedPoints.length < 3) {
                // Get mouse coordinates relative to the div
                const rect = event.target.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                // Add the clicked point to the list
                clickedPoints.push({ x, y });

                // If 3 points have been clicked, draw the parallelogram
                if (clickedPoints.length === 3) {
                    drawParallelogram();
                }
            }
        };

        const handleMouseDown = (event, index) => {
            // Set the index of the dragged point
            state.draggedPointIndex = index;
        
            // Remember the initial mouse coordinates
            state.startX = event.clientX;
            state.startY = event.clientY;
        
            // Remember the initial coordinates of the point
            state.startPointX = clickedPoints[index].x;
            state.startPointY = clickedPoints[index].y;
        
            // Add mousemove and mouseup event listeners
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };
        
        const handleMouseMove = (event) => {
            // Check if a point is being dragged
            if (state.draggedPointIndex !== null) {
                // Calculate the difference between current and initial mouse coordinates
                const diffX = event.clientX - state.startX;
                const diffY = event.clientY - state.startY;
        
                // Apply the difference to the initial coordinates of the point
                clickedPoints[state.draggedPointIndex].x = state.startPointX + diffX;
                clickedPoints[state.draggedPointIndex].y = state.startPointY + diffY;
        
            }
        };
        
        const handleMouseUp = () => {
            // Remove mousemove and mouseup event listeners
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        
            // Reset the dragged point index
            state.draggedPointIndex = null;
            clickedPoints.pop();
            drawParallelogram();
        };
        
        
        
        // Function to draw parallelogram
        const drawParallelogram = () => {
            const [point1, point2, point3] = clickedPoints;

            // Calculate the fourth point of the parallelogram
            const point4 = {
                x: point3.x + (point2.x - point1.x),
                y: point3.y + (point2.y - point1.y),
            };

            // Push the fourth point to the list
            clickedPoints.push(point4);

            // Calculate the centroid of the parallelogram
            const centroid = {
                x: (point1.x + point2.x + point3.x + point4.x) / 4,
                y: (point1.y + point2.y + point3.y + point4.y) / 4,
            };

            // Calculate the area of the parallelogram
            const base = Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
            const height = Math.sqrt((point3.x - point1.x) ** 2 + (point3.y - point1.y) ** 2);
            const area = base * height;

            // Calculate the radius of the circle
            const radius = Math.sqrt(area / Math.PI);

            // Add the circle to the state
            circle.centroid = centroid;
            circle.radius = radius;

        };
        const ResetPoints = () => {
            clickedPoints.splice(0, clickedPoints.length);
        }
        return {
            clickedPoints,
            ResetPoints,
            handleClick,
            handleMouseDown,
            circle
        };
    },
}).mount('#app');
