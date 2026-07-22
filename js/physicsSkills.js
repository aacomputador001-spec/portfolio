document.addEventListener('DOMContentLoaded', () => {
    const title = document.getElementById('skills-title');
    const skillsSection = document.getElementById('skills');
    const badges = Array.from(document.querySelectorAll('.skill-badge'));
    
    let physicsEnabled = false;
    let engine;
    let runner;
    let badgeElements = [];
    
    // Matter.js aliases
    const Engine = Matter.Engine,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Events = Matter.Events;

    title.addEventListener('click', () => {
        if (physicsEnabled) {
            // Disable physics
            physicsEnabled = false;
            
            if (runner) {
                Runner.stop(runner);
                runner = null;
            }
            if (engine) {
                Engine.clear(engine);
                engine = null;
            }
            
            // Revert gracefully
            badges.forEach(badge => {
                badge.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                badge.style.transform = 'translate(0px, 0px) rotate(0rad)';
                
                // Remove transition after it's done
                setTimeout(() => {
                    if (!physicsEnabled) {
                        badge.style.transition = '';
                    }
                }, 800);
            });
            // Remove native title toggle
            return;
        }

        physicsEnabled = true;
        // Remove native title toggle
        
        // Remove transitions so they respond instantly to physics
        badges.forEach(badge => badge.style.transition = '');
        
        engine = Engine.create();
        const world = engine.world;
        
        const sectionRect = skillsSection.getBoundingClientRect();
        const width = skillsSection.clientWidth;
        const height = skillsSection.clientHeight;
        
        // Exact walls to keep badges inside the section
        const wallOptions = { isStatic: true, render: { visible: false }, friction: 0, restitution: 0.2 };
        const ground = Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions);
        const leftWall = Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
        const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);
        const ceiling = Bodies.rectangle(width / 2, -25, width, 50, wallOptions);
        
        Composite.add(world, [ground, leftWall, rightWall, ceiling]);
        
        const badgeBodies = [];
        badgeElements = [];
        
        badges.forEach(badge => {
            const rect = badge.getBoundingClientRect();
            // Calculate center position relative to the section
            const centerX = (rect.left + rect.width / 2) - sectionRect.left;
            const centerY = (rect.top + rect.height / 2) - sectionRect.top;
            
            badgeElements.push({
                element: badge,
                width: rect.width,
                height: rect.height,
                initialCenterX: centerX,
                initialCenterY: centerY
            });
        });
        
        badgeElements.forEach(item => {
            const body = Bodies.rectangle(
                item.initialCenterX, 
                item.initialCenterY, 
                item.width, 
                item.height, 
                {
                    chamfer: { radius: item.height / 2 },
                    restitution: 0.6,
                    friction: 0.1,
                    frictionAir: 0.01,
                    density: 0.001
                }
            );
            
            body.plugin.element = item.element;
            body.plugin.initialCenterX = item.initialCenterX;
            body.plugin.initialCenterY = item.initialCenterY;
            
            badgeBodies.push(body);
        });
        
        Composite.add(world, badgeBodies);
        
        const mouse = Mouse.create(skillsSection);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        
        Composite.add(world, mouseConstraint);
        
        // Prevent scroll interference
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
        
        Events.on(engine, 'afterUpdate', function() {
            if (!physicsEnabled) return;
            badgeBodies.forEach(body => {
                const el = body.plugin.element;
                // Calculate difference from initial layout position
                const dx = body.position.x - body.plugin.initialCenterX;
                const dy = body.position.y - body.plugin.initialCenterY;
                const angle = body.angle;
                
                el.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}rad)`;
            });
        });
        
        runner = Runner.create();
        Runner.run(runner, engine);
        
        // Basic resize handling
        window.addEventListener('resize', () => {
            if (!physicsEnabled) return;
            const newWidth = skillsSection.clientWidth;
            const newHeight = skillsSection.clientHeight;
            
            Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 25 });
            Matter.Body.setVertices(ground, Matter.Bodies.rectangle(newWidth / 2, newHeight + 25, newWidth, 50).vertices);
            
            Matter.Body.setPosition(rightWall, { x: newWidth + 25, y: newHeight / 2 });
            Matter.Body.setVertices(rightWall, Matter.Bodies.rectangle(newWidth + 25, newHeight / 2, 50, newHeight).vertices);
        });
    });
});
