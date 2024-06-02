
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.edit-img').forEach(img => {
        img.addEventListener('click', (e) => {
            const index = img.getAttribute('data-index');
            const checkbox = document.getElementById(`image-${index}`);
            checkbox.checked = !checkbox.checked;
            img.classList.toggle('checked', checkbox.checked);
        });
    });
});
