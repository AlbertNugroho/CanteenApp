import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import accountstyle from "../../styles/accountstyle";
import { useTheme } from "@react-navigation/native";

const account = () => {
  const { colors } = useTheme();
  return (
    <View style={accountstyle.container}>
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={accountstyle.card}
          source={require("../../assets/images/cardprofile.png")}

        />
        <View style={accountstyle.profilecontainer}>
          <Image
            style={accountstyle.pp}
            source={require("../../assets/images/image.png")}
          />
        </View>
        <View style={accountstyle.divider} />
        <View style={accountstyle.infocard}>
          <View style={accountstyle.infocontainer}>
            <Text style={accountstyle.label}>Name</Text>
            <Text style={accountstyle.text}>
              Name DINIGARIUSDOTUNGTROLELOCINABU
            </Text>
          </View>
          <View style={accountstyle.infodivider} />
          <View style={accountstyle.infocontainer}>
            <Text style={accountstyle.label}>Student ID</Text>
            <Text style={accountstyle.text}>2702300575</Text>
          </View>
          <View style={accountstyle.infodivider} />
          <View style={accountstyle.infocontainer}>
            <Text style={accountstyle.label}>Email</Text>
            <Text style={accountstyle.text}>alb.nigarius@binus.ac.id</Text>
          </View>
          <View style={accountstyle.infodivider} />
          <View style={accountstyle.infocontainer}>
            <Text style={accountstyle.label}>Phone Number</Text>
            <Text style={accountstyle.text}>
              +62121111212122133232132313131
            </Text>
          </View>
        </View>
        <View style={accountstyle.infocard}>
          <TouchableOpacity>
            <View style={accountstyle.buttoncontainer}>
              <Image source={require("../../assets/images/lock.png")} />
              <Text style={accountstyle.buttontext}>Change Password</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={accountstyle.infocard}>
          <TouchableOpacity>
            <View style={accountstyle.buttoncontainer}>
              <Image source={require("../../assets/images/logout.png")} />
              <Text style={accountstyle.buttontext}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={accountstyle.bottominfo}>
          <TouchableOpacity>
            <Text style={accountstyle.bottomtext}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={accountstyle.bottomtext}>Terms & Conditions</Text>
          </TouchableOpacity>
          <Text style={accountstyle.info}>Version 0.1.0</Text>
          <Text style={accountstyle.info}>
            Copyright ckcakcbaiclcooacnaouvbwovakn nnnnnnnnnnnnnnnnnnnnn
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default account;
