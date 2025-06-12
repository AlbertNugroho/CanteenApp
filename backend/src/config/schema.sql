-- Create detail_cart table
CREATE TABLE detail_cart (
  id_detail_cart INT AUTO_INCREMENT PRIMARY KEY,
  id_cart INT NOT NULL,
  id_menu VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  selected_addons TEXT,
  FOREIGN KEY (id_cart) REFERENCES cart(id_cart) ON DELETE CASCADE,
  FOREIGN KEY (id_menu) REFERENCES menu(id_menu)
); 