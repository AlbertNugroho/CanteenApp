-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: binus-canteen.ccwdj10d7vx1.us-east-1.rds.amazonaws.com    Database: binuscanteen
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `addons`
--

DROP TABLE IF EXISTS `addons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addons` (
  `id_addons` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `id_tenant` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_addon` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  `deskripsi` text COLLATE utf8mb4_general_ci,
  `availability` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_addons`),
  KEY `id_tenant` (`id_tenant`),
  CONSTRAINT `addons_ibfk_1` FOREIGN KEY (`id_tenant`) REFERENCES `mstenant` (`id_tenant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addons`
--

LOCK TABLES `addons` WRITE;
/*!40000 ALTER TABLE `addons` DISABLE KEYS */;
/*!40000 ALTER TABLE `addons` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `before_insert_addons` BEFORE INSERT ON `addons` FOR EACH ROW BEGIN
    DECLARE urutan INT DEFAULT 1;
    DECLARE id_baru VARCHAR(20);
    SELECT COUNT(*) + 1 INTO urutan
    FROM addons
    WHERE id_tenant = NEW.id_tenant;
    SET id_baru = CONCAT(NEW.id_tenant, '-A', LPAD(urutan, 3, '0'));
    SET NEW.id_addons = id_baru;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id_cart` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_tenant` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `id_user` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id_cart`),
  KEY `id_tenant` (`id_tenant`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`id_tenant`) REFERENCES `mstenant` (`id_tenant`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `msuser` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `tg_cart_generate_id_cart` BEFORE INSERT ON `cart` FOR EACH ROW BEGIN
  DECLARE next_numeric_part INT;
  DECLARE current_max_numeric_part_str VARCHAR(10);
  DECLARE new_generated_id_cart VARCHAR(10); -- Sesuaikan ukuran jika perlu
  SELECT MAX(CAST(SUBSTRING(`id_cart`, 2) AS UNSIGNED))
  INTO next_numeric_part
  FROM `cart`
  WHERE `id_cart` LIKE 'C%';
  IF next_numeric_part IS NULL THEN
    SET next_numeric_part = 1;
  ELSE
    SET next_numeric_part = next_numeric_part + 1;
  END IF;
  SET new_generated_id_cart = CONCAT('C', LPAD(next_numeric_part, 3, '0'));
  SET NEW.id_cart = new_generated_id_cart;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `detail_cart`
--

DROP TABLE IF EXISTS `detail_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_cart` (
  `id_cart` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_detail_cart` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_menu` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id_detail_cart`),
  KEY `id_cart` (`id_cart`),
  KEY `id_menu` (`id_menu`),
  CONSTRAINT `detail_cart_ibfk_1` FOREIGN KEY (`id_cart`) REFERENCES `cart` (`id_cart`),
  CONSTRAINT `detail_cart_ibfk_2` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id_menu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_cart`
--

LOCK TABLES `detail_cart` WRITE;
/*!40000 ALTER TABLE `detail_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `detail_cart` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `tg_detail_cart_generate_id` BEFORE INSERT ON `detail_cart` FOR EACH ROW BEGIN
  DECLARE next_suffix_number INT;
  DECLARE new_generated_id_detail VARCHAR(20); -- Sesuaikan ukuran jika perlu
  SELECT MAX(CAST(SUBSTRING_INDEX(`id_detail_cart`, '-', -1) AS UNSIGNED))
  INTO next_suffix_number
  FROM `detail_cart` -- Ganti dengan nama tabel detail Anda
  WHERE `id_cart` = NEW.id_cart; -- Fokus hanya pada id_cart yang sama
  IF next_suffix_number IS NULL THEN
    SET next_suffix_number = 1;
  ELSE
    SET next_suffix_number = next_suffix_number + 1;
  END IF;
  SET new_generated_id_detail = CONCAT(NEW.id_cart, '-', LPAD(next_suffix_number, 3, '0'));
  SET NEW.id_detail_cart = new_generated_id_detail;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `detail_transaksi`
--

DROP TABLE IF EXISTS `detail_transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_transaksi` (
  `item_no` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_transaksi` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_menu` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` int NOT NULL,
  `id_addon` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  PRIMARY KEY (`item_no`),
  KEY `id_transaksi` (`id_transaksi`),
  KEY `id_menu` (`id_menu`),
  KEY `id_addon` (`id_addon`),
  CONSTRAINT `detail_transaksi_ibfk_1` FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi` (`id_transaksi`),
  CONSTRAINT `detail_transaksi_ibfk_2` FOREIGN KEY (`id_menu`) REFERENCES `menu` (`id_menu`),
  CONSTRAINT `detail_transaksi_ibfk_3` FOREIGN KEY (`id_addon`) REFERENCES `addons` (`id_addons`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_transaksi`
--

LOCK TABLES `detail_transaksi` WRITE;
/*!40000 ALTER TABLE `detail_transaksi` DISABLE KEYS */;
INSERT INTO `detail_transaksi` VALUES ('T007-CAL001-20250617122836-001','T007-CAL001-20250617122836','T007-001',1,NULL,300000.00);
/*!40000 ALTER TABLE `detail_transaksi` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `before_insert_detail_transaksi` BEFORE INSERT ON `detail_transaksi` FOR EACH ROW BEGIN
    DECLARE urutan INT DEFAULT 1;
    DECLARE nomor VARCHAR(5);
    SELECT COUNT(*) + 1 INTO urutan
    FROM detail_transaksi
    WHERE id_transaksi = NEW.id_transaksi;
    SET nomor = LPAD(urutan, 3, '0');
    SET NEW.item_no = CONCAT(NEW.id_transaksi, '-', nomor);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu` (
  `id_menu` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `id_tenant` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nama_menu` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `harga_menu` decimal(10,2) NOT NULL,
  `availability` tinyint(1) NOT NULL DEFAULT '1',
  `deskripsi` text COLLATE utf8mb4_general_ci,
  `gambar_menu` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_menu`),
  KEY `id_tenant` (`id_tenant`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`id_tenant`) REFERENCES `mstenant` (`id_tenant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
/*!40000 ALTER TABLE `menu` DISABLE KEYS */;
INSERT INTO `menu` VALUES ('T002-001','T002','Hainan Rice Ayam Gepuk',25000.00,1,'Hainan Rice Ayam Gepuk',NULL),('T002-002','T002','Hainan Rice Ayam Steam',25000.00,1,'Hainan Rice Ayam Steam',NULL),('T007-001','T007','Chicken burger',300000.00,1,'Chick fil a burger','menu-images/menu-T007-001-1750163120412.jpg');
/*!40000 ALTER TABLE `menu` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `before_insert_menu` BEFORE INSERT ON `menu` FOR EACH ROW BEGIN
    DECLARE last_number INT DEFAULT 0;
    DECLARE next_number VARCHAR(3);
    SELECT IFNULL(MAX(CAST(SUBSTRING_INDEX(id_menu, '-', -1) AS UNSIGNED)), 0)
    INTO last_number
    FROM menu
    WHERE id_menu LIKE CONCAT(NEW.id_tenant, '-%');
    SET next_number = LPAD(last_number + 1, 3, '0');
    SET NEW.id_menu = CONCAT(NEW.id_tenant, '-', next_number);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `mstenant`
--

DROP TABLE IF EXISTS `mstenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mstenant` (
  `id_tenant` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `nama_tenant` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email_tenant` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `pw_tenant` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `gambar_tenant` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `slot_per_time` int DEFAULT NULL,
  PRIMARY KEY (`id_tenant`),
  UNIQUE KEY `email_tenant` (`email_tenant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mstenant`
--

LOCK TABLES `mstenant` WRITE;
/*!40000 ALTER TABLE `mstenant` DISABLE KEYS */;
INSERT INTO `mstenant` VALUES ('T002','Oriental Chicken Rice','oriental@gmail.com','oriental123',NULL,NULL),('T003','Bakmi Effata','effata@gmail.com','$2b$08$RlAeAt.7K817X1a87M3mUe8JsyFbSBUeRITY9G1YMud0rYuWbyeGS','tenant-images/tenant-T003-1750162076263.jpg',NULL),('T004','Cerita Cinta','cinta@gmail.com','$2b$08$lmonKE7b5B3WH5fSUV77COlaUzU4W53xNT5OLgMsytGl/J4wU5y32','tenant-images/tenant-T004-1750161493782.jpg',NULL),('T005','Mc Donnald\'s','mcd@gmail.com','$2b$08$7AHvFNLT9L6GJX7RK8HTBeGktGTlCg8EZUa1ses9LOpetrpYFJy.2','tenant-images/tenant-T005-1750162095577.jpg',NULL),('T006','Yoshinoya','y@gmail.com','$2b$08$4BMwGYgTIU9BB.qM9vfhp.kK9KviViKTBL3K8f9DTW9rwVcUYWPKC','tenant-images/tenant-T006-1750162860476.jpg',NULL),('T007','Chick fil a','cfa@gmail.com','$2b$08$KsVmiGxH1wMdQtWzCdNofe7Am8HKUnB6q7lO1hLhw1ERVTHNgkPay','tenant-images/tenant-T007-1750163236187.jpg',30);
/*!40000 ALTER TABLE `mstenant` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `before_insert_mstenant` BEFORE INSERT ON `mstenant` FOR EACH ROW BEGIN
    DECLARE next_id INT;
    DECLARE id_str VARCHAR(10);
    SELECT IFNULL(MAX(CAST(SUBSTRING(id_tenant, 2) AS UNSIGNED)), 0) + 1
    INTO next_id
    FROM mstenant;
    SET id_str = CONCAT('T', LPAD(next_id, 3, '0'));
    SET NEW.id_tenant = id_str;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `msuser`
--

DROP TABLE IF EXISTS `msuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `msuser` (
  `id_user` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nama_user` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email_user` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `pw_user` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `email_user` (`email_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `msuser`
--

LOCK TABLES `msuser` WRITE;
/*!40000 ALTER TABLE `msuser` DISABLE KEYS */;
INSERT INTO `msuser` VALUES ('CAL001','Albert ','albert@gmail.com','$2b$08$5d6jpwlzfNuLLEb1dToyg.GOB.h1.DPhyK.WnPc7glC8/SBYVSJSy'),('CEP001','Epos','epos@binus.ac.id','Epos234'),('CEP002','epos','epos@gmail.com','$2b$08$co3qK82/REVJgsiO/rU1Seex4q0WeMT0jT5jMC8OAzXIuwaZFTkSS'),('COK001','Okky Pria Unik','okky.unik@binus.ac.id','8008135'),('COK002','Okky Pria Sigma','okky.sigma@binus.ac.id','8008135'),('CTO001','tolol1','tolol123@gmail.com','$2b$08$vkb5ll3Ppv75xKfPH80aaO6vzNiMaKXQDDpZMxpqrjB0GvjInknre');
/*!40000 ALTER TABLE `msuser` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `before_insert_msuser` BEFORE INSERT ON `msuser` FOR EACH ROW BEGIN
    DECLARE prefix VARCHAR(3);
    DECLARE last_number INT;
    DECLARE next_number VARCHAR(3);
    SET prefix = CONCAT('C', UPPER(LEFT(NEW.nama_user, 2)));
    SELECT IFNULL(MAX(CAST(SUBSTRING(id_user, 4) AS UNSIGNED)), 0)
    INTO last_number
    FROM msuser
    WHERE SUBSTRING(id_user, 1, 3) = prefix;
    SET next_number = LPAD(last_number + 1, 3, '0');
    SET NEW.id_user = CONCAT(prefix, next_number);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `transaksi`
--

DROP TABLE IF EXISTS `transaksi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaksi` (
  `id_transaksi` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `id_tenant` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_user` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `transaction_date` datetime NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `status` enum('On Process','Pending','Completed','Cancelled') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'On Process',
  `timeslot` time DEFAULT NULL,
  PRIMARY KEY (`id_transaksi`),
  KEY `id_tenant` (`id_tenant`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_tenant`) REFERENCES `mstenant` (`id_tenant`),
  CONSTRAINT `transaksi_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `msuser` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaksi`
--

LOCK TABLES `transaksi` WRITE;
/*!40000 ALTER TABLE `transaksi` DISABLE KEYS */;
INSERT INTO `transaksi` VALUES ('T007-CAL001-20250617122836','T007','CAL001','2025-06-17 12:28:36',300000.00,'Completed','13:00:00');
/*!40000 ALTER TABLE `transaksi` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`admin`@`%`*/ /*!50003 TRIGGER `before_insert_transaksi` BEFORE INSERT ON `transaksi` FOR EACH ROW BEGIN
    DECLARE ts VARCHAR(14);  -- Untuk timestamp yyyymmddhhmmss
    SET ts = DATE_FORMAT(NOW(), '%Y%m%d%H%i%s');
    SET NEW.id_transaksi = CONCAT(NEW.id_tenant, '-', NEW.id_user, '-', ts);
    SET NEW.transaction_date = NOW(); -- Optional, kalau belum diisi
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-18 14:56:08
